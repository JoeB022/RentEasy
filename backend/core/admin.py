from django.contrib import admin
from django.contrib.auth import get_user_model
from .models import (
    Property,
    Booking,
    PropertyImage,
    Payment,
    PropertyComment,
    Service,
    ServiceBooking,
)

User = get_user_model()

@admin.register(Property)
class PropertyAdmin(admin.ModelAdmin):
    list_display = ('title', 'location', 'price', 'status', 'availability', 'landlord')
    list_filter = ('status', 'availability', 'location')
    search_fields = ('title', 'location', 'landlord__username')
    actions = ['mark_as_occupied']

    @admin.action(description='Mark selected properties as Occupied')
    def mark_as_occupied(self, request, queryset):
        updated = queryset.update(status='occupied', availability=False)
        self.message_user(request, f"{updated} property(s) marked as occupied.")

@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):
    list_display = ('tenant', 'property', 'status', 'created_at')
    list_filter = ('status', 'created_at')
    search_fields = ('tenant__username', 'property__title')
    actions = ['approve_booking']

    @admin.action(description='Approve selected bookings')
    def approve_booking(self, request, queryset):
        updated = 0
        for booking in queryset:
            if booking.status == 'pending':
                booking.status = 'approved'
                booking.save()
                booking.property.status = 'occupied'
                booking.property.availability = False
                booking.property.save()
                updated += 1
        self.message_user(request, f"{updated} booking(s) approved and properties marked as occupied.")

@admin.register(PropertyImage)
class PropertyImageAdmin(admin.ModelAdmin):
    list_display = ('property', 'image')

@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display = ('tenant', 'property', 'amount', 'method', 'status', 'timestamp')
    list_filter = ('status', 'method', 'timestamp')
    search_fields = ('tenant__username', 'property__title')

@admin.register(PropertyComment)
class PropertyCommentAdmin(admin.ModelAdmin):
    list_display = ('property', 'tenant', 'text', 'timestamp')
    search_fields = ('property__title', 'tenant__username')

@admin.register(User)
class CustomUserAdmin(admin.ModelAdmin):
    list_display = ('username', 'email', 'role', 'is_active', 'is_staff')
    list_filter = ('role', 'is_active', 'is_staff')
    search_fields = ('username', 'email')

@admin.register(Service)
class ServiceAdmin(admin.ModelAdmin):
    list_display = ('name', 'rate', 'is_active')
    list_filter = ('is_active',)
    search_fields = ('name',)

@admin.register(ServiceBooking)
class ServiceBookingAdmin(admin.ModelAdmin):
    list_display = ('service', 'tenant', 'requested_date', 'status')
    list_filter = ('status', 'requested_date')
    search_fields = ('tenant__username', 'service__name')
    actions = ['approve_booking']

    @admin.action(description='Approve selected service bookings')
    def approve_booking(self, request, queryset):
        updated = 0
        for booking in queryset:
            if booking.status == 'pending':
                booking.status = 'approved'
                booking.save()
                updated += 1
        self.message_user(request, f"{updated} service booking(s) approved.")