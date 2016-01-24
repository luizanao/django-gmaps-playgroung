from __future__ import unicode_literals
from django.contrib.gis.db import models


class Polygon(models.Model):
    polygons = models.MultiPolygonField()
    created = models.DateTimeField(auto_now_add=True)
    objects = models.GeoManager()
