var r;

$(document).ready(function () {

    const verticalLinePlugin = {
        getLinePosition: function (chart, pointIndex) {
            const meta = chart.getDatasetMeta(0); // first dataset is used to discover X coordinate of a point
            const data = meta.data;
            return data[pointIndex]._model.x;
        },
        renderVerticalLine: function (chartInstance, pointIndex) {
            const lineLeftOffset = this.getLinePosition(chartInstance, pointIndex);
            const scale = chartInstance.scales['y-axis-0'];
            const context = chartInstance.chart.ctx;

            // render vertical line
            context.beginPath();
            context.strokeStyle = '#000000';
            context.lineWidth = 3;
            context.moveTo(lineLeftOffset, scale.top);
            context.lineTo(lineLeftOffset, scale.bottom);
            context.stroke();

            // write label
        },

        afterDatasetsDraw: function (chart, easing) {
            if (chart.config.lineAtIndex) {
                chart.config.lineAtIndex.forEach(pointIndex => this.renderVerticalLine(chart, pointIndex));
            }
        }
    };

    Chart.plugins.register(verticalLinePlugin);

    $.ajaxSetup({
        beforeSend: function (xhr, settings) {
            function getCookie(name) {
                var cookieValue = null;
                if (document.cookie && document.cookie != '') {
                    var cookies = document.cookie.split(';');
                    for (var i = 0; i < cookies.length; i++) {
                        var cookie = jQuery.trim(cookies[i]);
                        // Does this cookie string begin with the name we want?
                        if (cookie.substring(0, name.length + 1) == (name + '=')) {
                            cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                            break;
                        }
                    }
                }
                return cookieValue;
            }
            if (!(/^http:.*/.test(settings.url) || /^https:.*/.test(settings.url))) {
                // Only send the token to relative URLs i.e. locally.
                xhr.setRequestHeader("X-CSRFToken", getCookie('csrftoken'));
            }
        }
    });

    $.ajax({
        type: 'GET',
        url: "/get_page_stats/" + page_id + "/",
        success: function (result) {

            console.log(result.page_req.versions);

            var names = [];
            var conv_rates = [];

            for (var i = 0; i < result.page_req.versions.length; i++) {
                names.push(result.page_req.versions[i].slug);
                conv_rates.push(result.page_req.versions[i].conv_rate);

                $('#table_body').append('<tr><td>' +
                    result.page_req.versions[i].slug + '</td><td>' +
                    result.page_req.versions[i].hits + '</td><td>' +
                    result.page_req.versions[i].req + '</td><td>' +
                    result.page_req.versions[i].conv_rate.toFixed(2) + '%</td></tr>');
            }

            r = result.page_req.line_data
            var ctx1 = document.getElementById('hits').getContext('2d');
            var gradientFill = ctx1.createLinearGradient(0, 200, 0, 400);
            gradientFill.addColorStop(0, "rgba(128, 182, 244, 1.0)");
            gradientFill.addColorStop(1, "rgba(244, 244, 244, 0.0)");

            new Chart(ctx1, {
                type: 'line',
                lineAtIndex: result.page_req.line_data,
                plugins: [ChartDataLabels],
                data: {
                    labels: result.page_req.labels,
                    datasets: [{
                        label: 'Anfragen',
                        data: result.page_req.req_data,
                        fill: true,
                        borderColor: '#2196f3', // Add custom color border (Line)
                        backgroundColor: '#2196f3', // Add custom color background (Points and Fill)
                        borderWidth: 1 // Specify bar border width
                    }, {
                        label: 'Aufrufe',
                        data: result.page_req.hit_data,
                        fill: true,
                        backgroundColor: '#9Af6f6',
                        borderColor: '#ee9613', // Add custom color border (Line)
                        borderWidth: 1 // Specify bar border width
                    }],
                },
                options: {
                    plugins: {
                        // Change options for ALL labels of THIS CHART
                        datalabels: {
                            color: '#36A2EB00'
                        }
                    },
                    responsive: true, // Instruct chart js to respond nicely.
                    maintainAspectRatio: true, // Add to prevent default behaviour of full-width/height 
                    scales: {
                        yAxes: [{

                            type: 'linear',
                            position: 'left',
                            ticks: {
                                max: 25,
                                min: 0
                            }
                        }],
                        xAxes: [{
                            type: 'time',
                            distribution: 'series',
                            time: {
                                unit: 'day'
                            },
                            gridLines: {
                                zeroLineColor: "transparent",
                                drawTicks: false,
                                display: false
                            },
                            ticks: {
                                padding: 5,
                                fontColor: "rgba(0,0,0,0.5)",
                                fontStyle: "bold"
                            }
                        }]
                    }
                }
            });

            var ctx2 = document.getElementById('trend').getContext('2d');

            new Chart(ctx2, {
                type: 'bar',
                plugins: [ChartDataLabels],
                data: {
                    labels: names,
                    datasets: [{
                        label: 'Conversion %',
                        data: conv_rates,
                        fill: true,
                        borderColor: '#2196f3', // Add custom color border (Line)
                        backgroundColor: '#2196f3', // Add custom color background (Points and Fill)
                        borderWidth: 1 // Specify bar border width
                    }],
                },
                options: {
                    plugins: {
                        // Change options for ALL labels of THIS CHART
                        datalabels: {
                            color: '#36A2EB00'
                        }
                    },
                    responsive: true, // Instruct chart js to respond nicely.
                    maintainAspectRatio: true, // Add to prevent default behaviour of full-width/height 
                    scales: {
                        yAxes: [{
                            type: 'linear',
                            position: 'left',
                        }],
                        xAxes: [{
                            gridLines: {
                                zeroLineColor: "transparent",
                                drawTicks: false,
                                display: false
                            },
                            ticks: {
                                padding: 5,
                                fontColor: "rgba(0,0,0,0.5)",
                                fontStyle: "bold"
                            }
                        }]
                    }
                }
            });

        }
    });
});