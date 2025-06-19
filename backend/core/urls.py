from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,  # ✅ Correct JWT view
)

from .views import (
    RegisterView,
    PropertyListView,
    PropertyCreateView,
    PropertyUpdateDeleteView,
    PropertyImageUploadView,
    book_property,
    PropertyViewSet,
    BookingViewSet,
    approve_booking,
    mark_property_occupied,
    PaymentViewSet,
    PropertyCommentViewSet,
    ServiceViewSet,
    ServiceBookingViewSet,
    UserViewSet,
    AnalyticsView,
    CustomTokenObtainPairView,  # 👤 Custom login view
)

from core.views import (
    LandlordOnlyView,
    TenantOnlyView,
    AdminOnlyView,
)

# 🚦 DRF Router setup for ViewSets
router = DefaultRouter()
router.register(r'properties', PropertyViewSet, basename='property')
router.register(r'bookings', BookingViewSet, basename='booking')
router.register(r'payments', PaymentViewSet, basename='payment')
router.register(r'comments', PropertyCommentViewSet, basename='comment')
router.register(r'services', ServiceViewSet, basename='service')
router.register(r'service-bookings', ServiceBookingViewSet, basename='service-booking')
router.register(r'users', UserViewSet, basename='user')

# 📡 URL patterns
urlpatterns = [
    # 🔐 Authentication and roles
    path('token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('register/', RegisterView.as_view(), name='auth_register'),
    path('landlord-only/', LandlordOnlyView.as_view(), name='landlord-only'),
    path('tenant-only/', TenantOnlyView.as_view(), name='tenant-only'),
    path('admin-only/', AdminOnlyView.as_view(), name='admin-only'),

    # 🏠 Property operations
    path('property-list/', PropertyListView.as_view(), name='property-list'),
    path('property-create/', PropertyCreateView.as_view(), name='property-create'),
    path('properties/<int:pk>/', PropertyUpdateDeleteView.as_view(), name='property-update-delete'),
    path('properties/<int:property_id>/upload-images/', PropertyImageUploadView.as_view(), name='property-image-upload'),
    path('book/<int:property_id>/', book_property, name='book-property'),

    # 🛠 Admin actions
    path('admin/approve-booking/<int:booking_id>/', approve_booking, name='admin-approve-booking'),
    path('admin/mark-occupied/<int:property_id>/', mark_property_occupied, name='admin-mark-occupied'),

    # 🔁 ViewSets routing
    path('', include(router.urls)),

    # 📊 Analytics
    path('admin/analytics/', AnalyticsView.as_view(), name='admin-analytics'),
]

# 🖼️ Serve media files in development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
