from django.shortcuts import render
from .models import CourseDate, CourseRegistration
from .forms import RegisterForCourse
from landing.views import send_mail
from django.http import HttpResponseRedirect

# Create your views here.

def landingpagePrivate(request):
    course_dates = CourseDate.objects.all().order_by('date')
    return render(request,'landing_private/privatelanding.html',{"courses":course_dates})

def dankePrivat(request):
    return render(request,'landing_private/danke_privat.html')

def anmelden(request, id):
    course = CourseDate.objects.get(id=id)
    if request.method == 'POST':
        form = RegisterForCourse(request.POST)
        if form.is_valid():
            c = CourseDate.objects.get(id=id)
            customer_request = CourseRegistration.objects.create()
            customer_request.course_type = c.location+" "+c.location_post_id
            customer_request.customer_name = form.cleaned_data['first_name']+" "+form.cleaned_data['second_name']
            customer_request.customer_komentar = form.cleaned_data['birthday']+" "+form.cleaned_data['birth_location']
            customer_request.customer_email = form.cleaned_data['your_email']
            customer_request.customer_anzahl_teilnehmer = "1"
            customer_request.customer_anschrift = ""
            customer_request.save()
        
            formatedDate = form.cleaned_data['birthday'] 
            msg = """
            Guten Tag, 
            mein Name ist %s 
            ich melde mich hiermit für die Schulung am %s
             in %s 
            an. Mein Geb. Datum ist %s
             und der Geburtsort ist %s
              bitte schicken Sie die Rechnung und Kursinformationen an folgende Emailadresse: %s""" % (
                  customer_request.customer_name,
                  course.date.strftime('%Y-%m-%d'),
                  customer_request.course_type,
                  formatedDate,
                  form.cleaned_data['birth_location'],
                  form.cleaned_data['your_email'])

            send_mail("Private Schulungsanfrage",msg,
                        "info@schmidtschulungen.de", ["joshschmidt98@gmail.com","info@kranschulungschmidt.de"])
            return HttpResponseRedirect("/dankeprivat")
    else:
        form = RegisterForCourse()
    return render(request,'landing_private/anmelden.html',{'request_form': form, 'course': course})
