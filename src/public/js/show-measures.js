// variables para las graficas
// variables para las graficas
let label_date = [];
let data_value1 = [];
let data_value2 = [];
let data_value3 = [];
let ctx = document.getElementById('myChart').getContext('2d');

let chart = new Chart(ctx, {
    // The type of chart we want to create
    type: 'line',
    // The data for our dataset
    data: {
        labels: label_date,
        datasets: [{
            label: 'MQ-5',
            backgroundColor: 'rgba(255, 0, 0, 0.6)',
            borderColor: 'rgba(255, 0, 0, 0.8)',
            data: data_value1,
            borderWidth: 1,
            fill: true,
            pointRadius: 7,
            pointHoverRadius: 13,
            showLine: true,
            pointStyle: 'circle'
        }, {
            label: 'MQ-6',
            backgroundColor: 'rgba(255, 255, 0, 0.6)',
            borderColor: 'rgba(255, 255, 0, 0.8)',
            data: data_value2,
            borderWidth: 1,
            fill: true,
            pointRadius: 7,
            pointHoverRadius: 13,
            showLine: true,
            pointStyle: 'triangle'
        }, {
            label: 'MQ-7',
            backgroundColor: 'rgba(255, 0, 255, 0.6)',
            borderColor: 'rgba(255, 0, 255, 0.8)',
            data: data_value3,
            borderWidth: 1,
            fill: true,
            pointRadius: 7,
            pointHoverRadius: 13,
            showLine: true,
            pointStyle: 'triangle'
        }]
    },

    // Configuration options go here
    options: {
        title: {
            display: true,
            text: 'Historico de datos - GasDetector'
        },
        scales: {
            yAxes: [{
                scaleLabel: {
                    display: true,
                    labelString: 'ppm'
                }
            }],
            xAxes: [{
                scaleLabel: {
                    display: true,
                    labelString: 'Date'
                }
            }]
        }
    }
});

var xhttp = new XMLHttpRequest();
xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
        const plot_data = JSON.parse(this.responseText);
        let cont = 0;
        plot_data.forEach(function(element) {
            if (element.sensor_type == "MQ-5") {
                data_value1.push(element.value);
            } else if (element.sensor_type == "MQ-6") {
                data_value2.push(element.value);
            } else if (element.sensor_type == "MQ-7") {
                data_value3.push(element.value);
            }
            cont = cont + 1;
            if (cont == 3) {
                label_date.push(element.date);
                cont = 0;
            }
        });
        chart.update();
    }
};
xhttp.open("GET", "http://localhost:3000/measures/get-data-plot", true);
xhttp.send();