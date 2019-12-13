let socket = io();

let value_s1 = document.getElementById("value_s1");
let value_s2 = document.getElementById("value_s2");
let value_s3 = document.getElementById("value_s3");

let type_s1 = document.getElementById("type_s1");
let type_s2 = document.getElementById("type_s2");
let type_s3 = document.getElementById("type_s3");

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
            label: 'MQ-X1',
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
            label: 'MQ-X2',
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
            label: 'MQ-X3',
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
            text: 'Grafica de datos actuales - GasDetector'
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

// evento de escucha para la comunicacion serial
socket.on('SerialData', function(data) {
    console.log('SerialData: ' + data);

    let obj = JSON.parse(data);

    type_s1.innerHTML = obj[0].type;
    value_s1.innerHTML = obj[0].value;
    data_value1.push(obj[0].value);

    type_s2.innerHTML = obj[1].type;
    value_s2.innerHTML = obj[1].value;
    data_value2.push(obj[1].value);

    type_s3.innerHTML = obj[2].type;
    value_s3.innerHTML = obj[2].value;
    data_value3.push(obj[2].value);

    let timestamp = new Date();
    let date = timestamp.getDate() + "/" + timestamp.getMonth() + "/" + timestamp.getFullYear();
    let time = timestamp.getHours() + "/" + timestamp.getMinutes() + "/" + timestamp.getSeconds();

    if (obj[0].value > 50) {
        alertify.message('El MQ-5 el el limite seguro');
    }

    label_date.push(date + " " + time);
    chart.update();
});