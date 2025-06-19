from django.contrib.auth.models import AbstractUser
from django.db import models
from django.conf import settings


# 🔐 Extended User model
class User(AbstractUser):
    ROLE_CHOICES = (
        ('tenant', 'Tenant'),
        ('landlord', 'Landlord'),
        ('admin', 'Admin'),
    )
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='tenant')

    def __str__(self):
        return f"{self.username} ({self.role})"


# 🏘️ Property listing
class Property(models.Model):
    landlord = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='properties')
    title = models.CharField(max_length=100)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    location = models.CharField(max_length=100)
    house_number = models.CharField(max_length=20)
    availability = models.BooleanField(default=True)
    status = models.CharField(max_length=10, choices=[
        ('vacant', 'Vacant'),
        ('occupied', 'Occupied')
    ], default='vacant')
    created_at = models.DateTimeField(auto_now_add=True)
    is_approved = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.title} - {self.location}"


# 🖼️ Property images
class PropertyImage(models.Model):
    property = models.ForeignKey(Property, on_delete=models.CASCADE, related_name='images')
    image = models.ImageField(upload_to='property_images/')


# 📩 Booking model
class Booking(models.Model):
    tenant = models.ForeignKey(User, on_delete=models.CASCADE, related_name='bookings')
    property = models.ForeignKey(Property, on_delete=models.CASCADE, related_name='bookings')
    status = models.CharField(max_length=20, choices=[
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected')
    ], default='pending')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.tenant.username} - {self.property.title} ({self.status})"


# 💳 Payment model
class Payment(models.Model):
    PAYMENT_METHOD_CHOICES = [
        ('mpesa', 'M-Pesa'),
        ('card', 'Card'),
        ('paypal', 'PayPal'),
    ]
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('completed', 'Completed'),
        ('failed', 'Failed'),
    ]

    tenant = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='payments')
    property = models.ForeignKey(Property, on_delete=models.CASCADE, related_name='payments')
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    method = models.CharField(max_length=10, choices=PAYMENT_METHOD_CHOICES)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='pending')
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.tenant.username} - {self.amount} via {self.method} ({self.status})"
    
class PropertyComment(models.Model):
    property = models.ForeignKey(Property, on_delete=models.CASCADE, related_name='comments')
    tenant = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    text = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.tenant.username} on {self.property.name}"
    
class Service(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    rate = models.DecimalField(max_digits=10, decimal_places=2)  # Global base rate
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.name} - KES {self.rate}"

class ServiceBooking(models.Model):
    tenant = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    property = models.ForeignKey(Property, on_delete=models.CASCADE)
    service = models.ForeignKey(Service, on_delete=models.CASCADE)
    requested_date = models.DateTimeField()
    status = models.CharField(max_length=20, choices=[
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
        ('completed', 'Completed'),
    ], default='pending')
    notes = models.TextField(blank=True)

    def __str__(self):
        return f"{self.service.name} for {self.tenant.username} @ {self.property.name}"
    
