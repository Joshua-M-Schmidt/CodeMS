from django.db import models

# Create your models here.

KRAN = "KRAN"
STAPLER = "STAPLER"
HEBEBUEHNE = "HEBEBUEHNE"

COURSE_CHOICES = (
    (KRAN, "Kran"),
    (STAPLER, "Stapler"),
    (HEBEBUEHNE, "Hebebühne")
)

class Exam(models.Model):
    exam_name = models.CharField(max_length=50)
    exam_description = models.CharField(max_length=50,choices=COURSE_CHOICES, default=KRAN)

class Question(models.Model):
    question_text = models.CharField(max_length=200)
    answer1 = models.CharField(max_length=200)
    answer2 = models.CharField(max_length=200)
    answer3 = models.CharField(max_length=200)
    correct_answer = models.IntegerField(default=0)
    ex = models.ForeignKey(Exam, on_delete=models.CASCADE, default=1)

    def __str__(self):
        return self.question_text