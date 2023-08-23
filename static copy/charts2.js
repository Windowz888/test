const ctx2 = document.getElementById('chart2Canvas').getContext('2d');
const chart2 = new Chart(ctx2, {
    type: 'bar',
    data: {
        labels: [], // Initialize with an empty array
        datasets: [] 
    },
    options: {
        scales: {
            y: {
                beginAtZero: true
            }
        }
    }
});

const colors = {
    'Assault': {
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgba(255, 99, 132, 1)'
    },
    'Break and Enter': {
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderColor: 'rgba(54, 162, 235, 1)'
    },
    'Robbery': {
        backgroundColor: 'rgba(255, 206, 86, 0.2)',
        borderColor: 'rgba(255, 206, 86, 1)'
    },
    'Auto Theft': {
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)'
    },
    'Theft Over': {
        backgroundColor: 'rgba(153, 102, 255, 0.2)',
        borderColor: 'rgba(153, 102, 255, 1)'
    }
};

// Fetch the list of neighborhoods and populate the dropdown
fetch('/api/neighborhoods')
    .then(response => response.json())
    .then(data => {
        const neighborhoodSelect = document.getElementById('neighborhood');
        data.forEach(neighborhood => {
            const option = document.createElement('option');
            option.value = neighborhood;
            option.textContent = neighborhood;
            neighborhoodSelect.appendChild(option);
        });
    })
    .catch(error => {
        console.error("Error fetching neighborhoods:", error);
    });

// Update the chart data based on the selected neighborhood
document.getElementById('neighborhood').addEventListener('change', function(event) {
    const neighborhood = event.target.value;
    fetch(`/api/crime_data_by_neighborhood/${neighborhood}`)
        .then(response => response.json())
        .then(data => {
            const offenseTypes = [...new Set(data.map(item => item.mci_category))];
            const datasets = offenseTypes.map(offenseType => {
                return {
                    label: offenseType,
                    data: [data.find(item => item.mci_category === offenseType).count],
                    backgroundColor: colors[offenseType].backgroundColor,
                    borderColor: colors[offenseType].borderColor,
                    borderWidth: 1
                };
            });
            chart2.data.labels = [neighborhood];
            chart2.data.datasets = datasets;
            chart2.update();
        })
        .catch(error => {
            console.error("Error fetching data:", error);
        });
});



