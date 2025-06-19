from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Property, PropertyImage, Booking, Payment, PropertyComment, Service, ServiceBooking

# 🔐 Get the custom user model
User = get_user_model()

# 🔐 User Registration Serializer
class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    role = serializers.ChoiceField(choices=[('tenant', 'Tenant'), ('landlord', 'Landlord'), ('admin', 'Admin')])


    class Meta:
        model = User
        fields = ('username', 'email', 'password', 'role')

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email'),
            password=validated_data['password'],
            role=validated_data.get('role', 'tenant')  # default to 'tenant'
        )
        return user

# 🖼️ Property Image Serializer
class PropertyImageSerializer(serializers.ModelSerializer):
    image = serializers.ImageField(use_url=True)  # show image URL

    class Meta:
        model = PropertyImage
        fields = ['id', 'image']

# 🏠 Property Serializer (with landlord and images)
class PropertySerializer(serializers.ModelSerializer):
    landlord = serializers.ReadOnlyField(source='landlord.username')
    images = PropertyImageSerializer(many=True, read_only=True)

    class Meta:
        model = Property
        fields = '__all__'

class BookingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Booking
        fields = '__all__'

class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = '__all__'

class PropertyCommentSerializer(serializers.ModelSerializer):
    tenant_name = serializers.CharField(source='tenant.username', read_only=True)

    class Meta:
        model = PropertyComment
        fields = ['id', 'property', 'tenant', 'text', 'timestamp', 'tenant_name']

class ServiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Service
        fields = '__all__'

class ServiceBookingSerializer(serializers.ModelSerializer):
    tenant_name = serializers.CharField(source='tenant.username', read_only=True)
    property_name = serializers.CharField(source='property.name', read_only=True)
    service_name = serializers.CharField(source='service.name', read_only=True)

    class Meta:
        model = ServiceBooking
        fields = [
            'id', 'tenant', 'tenant_name', 'property', 'property_name',
            'service', 'service_name', 'requested_date', 'status', 'notes'
        ]
        read_only_fields = ['tenant']

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = get_user_model()
        fields = ['id', 'username', 'email', 'role', 'is_active']