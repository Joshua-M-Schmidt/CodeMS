from django.db import models

# Create your models here.

MANY_FREE_PLACES = "Plätze frei"
FEW_FREE_PLACES = "Wenige freie Plätze"
NO_FREE_PLACES = "Keine freie Plätze"

STATUS_CHOICES = (
    (MANY_FREE_PLACES,"FREE"),
    (FEW_FREE_PLACES, "FEW_FREE_PLACES"),
    (NO_FREE_PLACES, "NO_FREE_PLACES"),
)

class CourseDate(models.Model):
    date = models.DateField(null=True)
    time = models.TimeField(null=True)
    cost = models.FloatField(default=178.5)
    status = models.CharField(max_length=200, choices=STATUS_CHOICES, default=MANY_FREE_PLACES)
    location = models.CharField(max_length=200)
    location_post_id = models.CharField(max_length=200)

    def __str__(self):
        return self.location

class CourseRegistration(models.Model):
    course_type = models.CharField(max_length=60)
    customer_name = models.CharField(max_length=100)
    customer_email = models.CharField(max_length=100)
    customer_anschrift = models.CharField(max_length=100)
    customer_plz = models.CharField(max_length=100, default="00000")
    customer_anzahl_teilnehmer = models.CharField(max_length=100)
    customer_komentar = models.CharField(max_length=100)
    ydfvbsdfgh = models.CharField(max_length=100, default="empty") 

    def __str__(self):
        return self.course_type

