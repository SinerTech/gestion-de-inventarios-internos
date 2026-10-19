from django.urls import path

from .views import RegistrarVentaView

urlpatterns = [
    path("Ventas/", RegistrarVentaView.as_view(), name="registrar_venta")
]