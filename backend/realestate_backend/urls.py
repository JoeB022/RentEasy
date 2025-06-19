from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
    RefreshView
)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('core.urls')),                # Your app's API routes
    path('api/jwt/', TokenObtainPairView.as_view(), name='token_obtain_pair'),       # Get access & refresh tokens
    path('api/jwt/refresh/', TokenRefreshView.as_view(), name='token_refresh'),      # Refresh access token
    path('api/register/', RegisterView.as_view()),

]
