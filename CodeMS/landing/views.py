from django.shortcuts import render, redirect
from django.urls import reverse
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from .forms import RequestOffering, RequestOfferingCrane
from .models import CourseRequest, COURSE_TYPE_CHOICES
from django.core.mail import EmailMultiAlternatives
from datetime import date
import json
from landingbuilder.models import page
from django.core.exceptions import ObjectDoesNotExist

from django.core.mail import send_mail
# Create your views here.


def danke(request):
    return render(request,'landing/danke.html')

def splitView(request):
    return render(request,"landing/split.html")

def send(request):
    return HttpResponse("sende Email")

def kranlanding(request):
    if request.method == 'POST':
        form = RequestOfferingCrane(request.POST)
        if form.is_valid():
            request = CourseRequest.objects.create()
            request.course_type = [1]
            request.customer_name = form.cleaned_data['your_name']
            request.customer_email = form.cleaned_data['your_email']
            request.customer_anschrift = form.cleaned_data['your_address_company']
            request.customer_plz = form.cleaned_data['your_zip_code']
            request.customer_anzahl_teilnehmer = form.cleaned_data['people']
            request.customer_komentar = form.cleaned_data['coments']
            request.save()

            schulungen_liste = []

            schulungen_liste.append(COURSE_TYPE_CHOICES["1"])

            subject, from_email, to = 'Geschäftliche Schulungsanfrage', "info@schmidtschulungen.de", ["joshschmidt98@gmail.com","info@kranschulungschmidt.de"]
            text_content = 'This is an important message.'
            html_content =  "<p>Name: "+request.customer_name+"<br/>Emailadresse: "+request.customer_email+"<br/>Firma: "+request.customer_anschrift+"<br/>Schulungen: "+str(schulungen_liste)+"<br/>PLZ: "+request.customer_plz+"<br/>Teilnehmeranzahl: "+request.customer_anzahl_teilnehmer+"<br/>Kommentar: "+request.customer_komentar+"</p>"
            msg = EmailMultiAlternatives(subject, text_content, from_email, to)
            msg.attach_alternative(html_content, "text/html")
            msg.send()
            return HttpResponseRedirect('danke')
    else:
        form = RequestOfferingCrane()
    return render(request,'landing/kranlanding.html',{'request_form': form})

def info(request):
    return render(request,'landing/info.html',{})

def request(request):
    if request.method == 'POST':
        data = json.loads(request.body)

        print(data)

        request = CourseRequest.objects.create()
        request.course_type = data['schulungen']
        request.customer_name = data['name']
        request.customer_email = data['email']
        request.customer_phone = data['phone']
        request.customer_anschrift = data['firma']
        request.customer_plz = data['postleitzahl']
        request.customer_anzahl_teilnehmer = data['teilnehmer']
        request.customer_komentar = data['komentar']
        try:
            p = page.objects.get(slug=data['slug'])
            request.page_link = p
        except ObjectDoesNotExist:
            pass
        request.save()

        

        schulungen_liste = []

        schulungen = request.course_type
        for schulung in schulungen:
            schulungen_liste.append(COURSE_TYPE_CHOICES[schulung])

        emails = []


        subject, from_email, to = 'Geschäftliche Schulungsanfrage', "info@schmidtschulungen.de", ["joshschmidt98@gmail.com","info@kranschulungschmidt.de"]
        text_content = 'This is an important message.'
        html_content =  "<p>Name: "+request.customer_name+"<br/>Emailadresse: "+request.customer_email+"<br/>Telefon: "+request.customer_phone+"<br/>Firma: "+request.customer_anschrift+"<br/>Schulungen: "+str(schulungen_liste)+"<br/>PLZ: "+request.customer_plz+"<br/>Teilnehmeranzahl: "+request.customer_anzahl_teilnehmer+"<br/>Kommentar: "+request.customer_komentar+"</p>"
        msg = EmailMultiAlternatives(subject, text_content, from_email, to)
        msg.attach_alternative(html_content, "text/html")
        msg.send()

        return JsonResponse({'success':True})

def kontakt(request):
    if request.method == 'POST':
        form = RequestOffering(request.POST)
        if form.is_valid():
            customer_request = CourseRequest.objects.create()
            customer_request.course_type = form.cleaned_data['course_type']
            customer_request.customer_name = form.cleaned_data['your_name']
            customer_request.customer_email = form.cleaned_data['your_email']
            customer_request.customer_anschrift = form.cleaned_data['your_address_company']
            customer_request.customer_plz = form.cleaned_data['your_zip_code']
            customer_request.customer_anzahl_teilnehmer = form.cleaned_data['people']
            customer_request.customer_komentar = form.cleaned_data['coments']
            customer_request.save()
            return HttpResponseRedirect('danke')
    else:
        form = RequestOffering()
        return render(request,'landing/kontakt.html',{'request_form': form})