from django.db import models

class Codigo(models.Model):
    codigo = models.CharField(max_length=8, unique=True)
    nombre_completo = models.CharField(max_length=255, blank=True, null=True)
    habilitado = models.BooleanField(default=True)
    usado = models.BooleanField(default=False)

    def __str__(self):
        return self.codigo