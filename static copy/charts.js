const ctx = document.getElementById('chart1Canvas').getContext('2d');
const chart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        datasets: [{
            label: 'Number of Crimes',
            data: [], // Initialize with an empty array
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)',
                'rgba(255, 99, 132, 0.2)'
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)',
                'rgba(255, 99, 132, 1)'
            ],
            borderWidth: 1
        }]
    },
    options: {
        scales: {
            y: {
                beginAtZero: true
            }
        }
    }
});

document.getElementById('crimeType').addEventListener('change', function(event) {
    const crimeType = event.target.value;
    console.log("Selected crime type:", crimeType); 
    fetch(`/api/crime_data_by_type/${crimeType}`)
        .then(response => response.json())
        .then(data => {
            console.log("Data fetched from API:", data); 
            const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
            const counts = new Array(7).fill(0);
            data.forEach(item => {
                const dayIndex = days.indexOf(item.report_day.trim()); 
                if (dayIndex !== -1) {
                    counts[dayIndex] = item.count;
                }
            });
            console.log("Processed counts:", counts); 
            chart.data.datasets[0].data = counts;
            chart.update();
        })
        .catch(error => {
            console.error("Error fetching data:", error); 
        });
});









