from django.contrib import admin
from .models import Codigo

class CodigoAdmin(admin.ModelAdmin):
    list_display = ('codigo', 'nombre_completo', 'funcion', 'habilitado', 'usado')

# Register your models here.
admin.site.register(Codigo, CodigoAdmin)
