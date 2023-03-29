from django.db import models
from landingbuilder.models import page

# Create your models here.

class CourseRequest(models.Model):
    course_type = models.CharField(max_length=500)
    customer_name = models.CharField(max_length=100)
    customer_email = models.CharField(max_length=100)
    customer_anschrift = models.CharField(max_length=100)
    customer_plz = models.CharField(max_length=100, default="00000")
    customer_anzahl_teilnehmer = models.CharField(max_length=100)
    customer_komentar = models.CharField(max_length=100)
    customer_phone = models.CharField(max_length=200, default="000")
    page_link = models.ForeignKey(page, models.CASCADE, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True,blank=True, null=True)

    def __str__(self):
        return self.course_type

COURSE_TYPE_CHOICES = {
    "1": "Kranschulung",
    "2": "Staplerschulung",
    "3": "Hebebühnenschulung"
}
