from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Codigo
from .serializers import CodigoSerializer

class CodigoViewSet(viewsets.ModelViewSet):
    queryset = Codigo.objects.all()
    serializer_class = CodigoSerializer
    filterset_fields = ['codigo']
    lookup_field = 'codigo'

    @action(detail=True, methods=['post'])
    def decrementar_entradas(self, request, codigo=None):
        """
        Decrementa las entradas disponibles para un código.
        Acepta un parámetro 'cantidad' en el cuerpo de la solicitud.
        """
        codigo_obj = self.get_object()
        cantidad = request.data.get('cantidad', 1)

        if not isinstance(cantidad, int) or cantidad <= 0:
            return Response({'detail': 'La cantidad debe ser un entero positivo.'}, status=400)

        if codigo_obj.entradas_disponibles >= cantidad:
            codigo_obj.entradas_disponibles -= cantidad
            codigo_obj.save()
            serializer = self.get_serializer(codigo_obj)
            return Response(serializer.data)
        else:
            return Response({'detail': f'No hay suficientes entradas disponibles. Disponibles: {codigo_obj.entradas_disponibles}'}, status=400)

    @action(detail=True, methods=['post'])
    def incrementar_entradas(self, request, codigo=None):
        """
        Incrementa las entradas disponibles para un código.
        Acepta un parámetro 'cantidad' en el cuerpo de la solicitud.
        El total no puede exceder el valor por defecto de 2.
        """
        codigo_obj = self.get_object()
        cantidad = request.data.get('cantidad', 1)

        if not isinstance(cantidad, int) or cantidad <= 0:
            return Response({'detail': 'La cantidad debe ser un entero positivo.'}, status=400)

        # Prevenir que las entradas excedan el máximo (default=2)
        if codigo_obj.entradas_disponibles + cantidad > 2:
            codigo_obj.entradas_disponibles = 2
        else:
            codigo_obj.entradas_disponibles += cantidad
        
        codigo_obj.save()
        serializer = self.get_serializer(codigo_obj)
        return Response(serializer.data)