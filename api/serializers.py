from rest_framework import serializers
from .models import Codigo

class CodigoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Codigo
        fields = '__all__'
