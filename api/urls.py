from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CodigoViewSet

router = DefaultRouter()
router.register(r'codigos', CodigoViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
