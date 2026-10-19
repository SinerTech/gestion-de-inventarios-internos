from django.urls import path

from .views import RegistrarVentaView, ClienteListView

urlpatterns = [
    path("Ventas/", RegistrarVentaView.as_view(), name="registrar_venta"),
    path("clientes/", ClienteListView.as_view(), name="listar_clientes"),
]