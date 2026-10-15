from django.urls import path
from .views import IngresoView, MotivoView, AjusteView

urlpatterns = [
    path('motivos/', MotivoView.as_view()),
    path('ingresos/', IngresoView.as_view()),
    path('ajustes/', AjusteView.as_view())
]