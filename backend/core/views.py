# views.py

from django.contrib.auth import get_user_model
from django.shortcuts import get_object_or_404

from rest_framework import generics, permissions, status, viewsets
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes, action
from rest_framework.permissions import IsAdminUser
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django_filters.rest_framework import DjangoFilterBackend

from .models import Property, PropertyImage, Booking, Payment, PropertyComment, Service, ServiceBooking
from .serializers import (
    PropertySerializer, PropertyImageSerializer, BookingSerializer, RegisterSerializer,
    PaymentSerializer, PropertyCommentSerializer, ServiceSerializer, ServiceBookingSerializer, UserSerializer
)
from .permissions import IsLandlord, IsTenant, IsAdmin
from .filters import PropertyFilter

User = get_user_model()


# ---------------------------
# 🔐 JWT Authentication
# ---------------------------

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        data['role'] = self.user.role
        data['username'] = self.user.username
        return data

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer


# ---------------------------
# 🔐 Auth + Roles Endpoints
# ---------------------------

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]

class LandlordOnlyView(APIView):
    permission_classes = [permissions.IsAuthenticated, IsLandlord]

    def get(self, request):
        return Response({"message": "Hello Landlord!"})

class TenantOnlyView(APIView):
    permission_classes = [permissions.IsAuthenticated, IsTenant]

    def get(self, request):
        return Response({"message": "Hello Tenant!"})

class AdminOnlyView(APIView):
    permission_classes = [permissions.IsAuthenticated, IsAdmin]

    def get(self, request):
        return Response({"message": "Hello Admin!"})


# ---------------------------
# 📋 Property Views
# ---------------------------

class PropertyListView(generics.ListAPIView):
    queryset = Property.objects.all().order_by('-created_at')
    serializer_class = PropertySerializer
    permission_classes = [permissions.AllowAny]
    filter_backends = [DjangoFilterBackend]
    filterset_class = PropertyFilter

class PropertyCreateView(generics.CreateAPIView):
    queryset = Property.objects.all()
    serializer_class = PropertySerializer
    permission_classes = [permissions.IsAuthenticated, IsLandlord]

    def perform_create(self, serializer):
        serializer.save(landlord=self.request.user)

class PropertyUpdateDeleteView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = PropertySerializer
    permission_classes = [permissions.IsAuthenticated, IsLandlord]

    def get_queryset(self):
        return Property.objects.filter(landlord=self.request.user)

class PropertyImageUploadView(APIView):
    parser_classes = [MultiPartParser, FormParser]
    permission_classes = [permissions.IsAuthenticated, IsLandlord]

    def post(self, request, property_id):
        try:
            prop = Property.objects.get(id=property_id, landlord=request.user)
        except Property.DoesNotExist:
            return Response({'detail': 'Property not found or not yours.'}, status=404)

        files = request.FILES.getlist('images')
        images = [PropertyImage.objects.create(property=prop, image=file) for file in files]
        serializer = PropertyImageSerializer(images, many=True)
        return Response(serializer.data, status=201)


# ---------------------------
# 📦 Property ViewSet
# ---------------------------

class PropertyViewSet(viewsets.ModelViewSet):
    queryset = Property.objects.all().order_by('-created_at')
    serializer_class = PropertySerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def perform_create(self, serializer):
        serializer.save(landlord=self.request.user)

    @action(detail=True, methods=['post'], permission_classes=[IsAdminUser])
    def approve(self, request, pk=None):
        prop = self.get_object()
        if prop.is_approved:
            return Response({'detail': 'Property already approved.'}, status=400)

        prop.is_approved = True
        prop.save()
        return Response({'detail': f'Property "{prop.title}" approved.'}, status=200)


# ---------------------------
# 📅 Booking ViewSet
# ---------------------------

class BookingViewSet(viewsets.ModelViewSet):
    queryset = Booking.objects.all().order_by('-created_at')
    serializer_class = BookingSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(tenant=self.request.user)


# ---------------------------
# 💳 Payment ViewSet
# ---------------------------

class PaymentViewSet(viewsets.ModelViewSet):
    queryset = Payment.objects.all()
    serializer_class = PaymentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.is_staff or getattr(user, "role", None) == 'admin':
            return Payment.objects.all()
        return Payment.objects.filter(tenant=user)

    @action(detail=False, methods=['get'])
    def recent(self, request):
        payments = self.get_queryset().order_by('-timestamp')[:10]
        serializer = self.get_serializer(payments, many=True)
        return Response(serializer.data)


# ---------------------------
# 💬 Property Comments
# ---------------------------

class PropertyCommentViewSet(viewsets.ModelViewSet):
    queryset = PropertyComment.objects.all().order_by('-timestamp')
    serializer_class = PropertyCommentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(tenant=self.request.user)

    def get_queryset(self):
        property_id = self.request.query_params.get('property')
        if property_id:
            return self.queryset.filter(property_id=property_id)
        return self.queryset.none()


# ---------------------------
# 🛎️ Services
# ---------------------------

class ServiceViewSet(viewsets.ModelViewSet):
    queryset = Service.objects.all()
    serializer_class = ServiceSerializer

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsAdminUser()]
        return [permissions.AllowAny()]

class ServiceBookingViewSet(viewsets.ModelViewSet):
    queryset = ServiceBooking.objects.all().order_by('-requested_date')
    serializer_class = ServiceBookingSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(tenant=self.request.user)

    def get_queryset(self):
        user = self.request.user
        if user.is_staff:
            return self.queryset
        return self.queryset.filter(tenant=user)


# ---------------------------
# 👥 Users + Analytics
# ---------------------------

class UserViewSet(viewsets.ModelViewSet):
    queryset = get_user_model().objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAdminUser]

class AnalyticsView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        data = {
            'total_users': User.objects.count(),
            'total_properties': Property.objects.count(),
            'pending_bookings': Booking.objects.filter(status='pending').count(),
            'total_service_requests': ServiceBooking.objects.count(),
            'pending_service_requests': ServiceBooking.objects.filter(status='pending').count(),
            'total_payments': Payment.objects.count(),
            'completed_payments': Payment.objects.filter(status='completed').count(),
        }
        return Response(data)


# ---------------------------
# 🧾 Booking Action
# ---------------------------

@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def book_property(request, property_id):
    try:
        property_obj = Property.objects.get(id=property_id)

        if Booking.objects.filter(tenant=request.user, property=property_obj).exists():
            return Response({'detail': 'You have already booked this property.'}, status=400)

        if not property_obj.availability or property_obj.status != 'vacant':
            return Response({'error': 'Property is not available.'}, status=400)

        Booking.objects.create(
            tenant=request.user,
            property=property_obj,
            status='pending'
        )
        return Response({'message': 'Booking created. Awaiting approval.'}, status=201)

    except Property.DoesNotExist:
        return Response({'error': 'Property not found.'}, status=404)


# ---------------------------
# 🛠️ Admin Actions
# ---------------------------

@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated, IsAdmin])
def approve_booking(request, booking_id):
    booking = get_object_or_404(Booking, id=booking_id)

    if booking.status == 'approved':
        return Response({'message': 'Booking already approved.'}, status=400)

    booking.status = 'approved'
    booking.save()

    booking.property.status = 'occupied'
    booking.property.availability = False
    booking.property.save()

    return Response({'message': 'Booking approved and property marked as occupied.'}, status=200)

@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated, IsAdmin])
def mark_property_occupied(request, property_id):
    prop = get_object_or_404(Property, id=property_id)

    if prop.status == 'occupied':
        return Response({'message': 'Property already occupied.'}, status=400)

    prop.status = 'occupied'
    prop.availability = False
    prop.save()
    return Response({'message': 'Property marked as occupied.'}, status=200)
