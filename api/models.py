from django.db import models

class Codigo(models.Model):
    FUNCION_CHOICES = [
        ('primera', 'Primera'),
        ('segunda', 'Segunda'),
    ]
    codigo = models.CharField(max_length=8, unique=True)
    nombre_completo = models.CharField(max_length=255, blank=True, null=True)
    funcion = models.CharField(max_length=7, choices=FUNCION_CHOICES, default='primera', blank=False, null=False)
    habilitado = models.BooleanField(default=True)
    entradas_disponibles = models.IntegerField(default=2)

    def __str__(self):
        return self.codigo