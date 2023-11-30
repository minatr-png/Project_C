"use client";
import { database_url } from '@clsGlobals';
import CLSYearSwitch from '@clsYearSwitch';
import styles from  './styles.module.css';
import PocketBase from 'pocketbase';
import Chart from 'chart.js/auto';
import { useEffect, useState } from 'react';

const db = new PocketBase(database_url);

const prueba = () => {
    db.collection('Expenses').getFullList({ sort: '-created' }).then(res => {
        console.log(res);
    });
}

export default function Page() {
    let [years, setYears] = useState([]);
    useEffect(() => {
        db.collection('vExpensesYears').getFullList({ fields: 'year', sort: 'year'}).then((res) => {
            setYears(res.map(el => el.year));
        });

        var ctx = (document.getElementById('myChart') as any).getContext('2d');
        let chart = new Chart(ctx, {
            data: {
                labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
                datasets: [{
                    type: 'bar',
                    label: 'Balance',
                    data: [-12, 19, 3, -5, 2, 3, 3, 5, -9, 10, 11, 12],
                    borderWidth: 1
                }, {
                    label: 'Gastos',
                    data: [-12, 19, 3, -5, 2, 3, 3, 5, -9, 10, 11, 12],
                    type: 'line',
                    borderWidth: 1
                }]
            },
            options: {
                plugins: {
                    legend: {
                        display: true,
                        labels: {
                            //color: 'rgb(255, 99, 132)'
                        }
                    }
                }, 
                scales: {
                    y: {
                        ticks: {
                            //color: 'red'
                        }
                    },
                    x: {
                        ticks: {
                            //color: 'red'
                        }
                    }
                }
            }
        });
        }
    , []);

    const [expenses, setCategories] = useState([]);
    useEffect(() => {
        db.collection('categories').getFullList({ fields: 'order, descrip, id', sort: 'order' }).then((res) => {
            let loaded_categories = res.map(category => ({ data: { id: category.id, descrip: category.descrip }, id: category.order}));
            setCategories(loaded_categories);
        });
    }, []);

    const onYearChange = (year) => {
        console.log(year);
    };

    return (
        <div id="moduleContainer" className={styles.graphs + " bg-economics"}>
            <div className={styles.header}>
                <CLSYearSwitch years={years} onChange={year => onYearChange(year)}></CLSYearSwitch>
            </div>
            <div className={styles.body}>
                <div className={styles.graph}>
                    <div>
                        <canvas id='myChart'></canvas>
                    </div>
                </div>
            </div>
        </div>
    );
}