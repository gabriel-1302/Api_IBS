from rest_framework import viewsets
from .models import Codigo
from .serializers import CodigoSerializer

class CodigoViewSet(viewsets.ModelViewSet):
    queryset = Codigo.objects.all()
    serializer_class = CodigoSerializer
    filterset_fields = ['codigo']
    lookup_field = 'codigo'