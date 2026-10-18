from django.urls import path
from .views import ProductoListView, ProductoDetailView


urlpatterns = [
    path('productos/', ProductoListView.as_view(), name='producto-list'),
    path('productos/<int:id_producto>/', ProductoDetailView.as_view(), name='producto-detail',),
]
