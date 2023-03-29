from django import forms
import datetime

class NewExam(forms.Form):
    exam_name = forms.CharField(label='Name',max_length=100)
    exam_description = forms.CharField(label='Beschreibung',max_length=400)

class NewQuestion(forms.Form):
    question_text = forms.CharField(label='frage',max_length=200)
    answer1 = forms.CharField(label='Antwort A',max_length=200)
    answer2 = forms.CharField(label='Antwort B',max_length=200)
    answer3 = forms.CharField(label='Antwort C',max_length=200)
    correct_answer = forms.IntegerField(label='Richtige Antwort')