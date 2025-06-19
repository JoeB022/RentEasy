import django_filters
from .models import Property

class PropertyFilter(django_filters.FilterSet):
    min_price = django_filters.NumberFilter(field_name='price', lookup_expr='gte')
    max_price = django_filters.NumberFilter(field_name='price', lookup_expr='lte')
    location = django_filters.CharFilter(field_name='location', lookup_expr='icontains')  # case-insensitive
    status = django_filters.CharFilter(field_name='status')

    class Meta:
        model = Property
        fields = ['status', 'location', 'min_price', 'max_price']
