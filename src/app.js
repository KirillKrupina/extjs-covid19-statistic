Ext.onReady(function () {


    // var myStore = Ext.create(Ext.data.Json {
    //     //storeID: 'covidStat',
    //     autoLoad: true,
    //     proxy: {
    //         type: 'ajax',
    //         url: 'https://covid-19-coronavirus-statistics.p.rapidapi.com/v1/stats',
    //         headers: {
    //             "x-rapidapi-host": "covid-19-coronavirus-statistics.p.rapidapi.com",
    //             "x-rapidapi-key": "8cd8d0f7bbmsh3c7897746993edfp13840ejsn40f673bcd163"
    //         },
    //         reader: {
    //             type: 'json',
    //             successProperty: 'success',
    //             root: 'data/covid19Stats'
    //         }

    //     },
    //     listeners: {
    //         load: function () {
    //             console.log('loaded');
    //         }
    //     },
    //     fields: [
    //         {},
    //         {},
    //         {},
    //         {},
    //         {},
    //         {}
    //     ]
    // })
    // http proxy

    var myGrid = Ext.create({
        xtype: 'grid',
        itemId: 'grid',
        height: 635,
        store: {
            xtype: 'jsonstore',
            autoLoad: true,
            proxy: new Ext.data.HttpProxy({
                url: 'https://covid-19-coronavirus-statistics.p.rapidapi.com/v1/stats',
                headers: {
                    "x-rapidapi-host": "covid-19-coronavirus-statistics.p.rapidapi.com",
                    "x-rapidapi-key": "8cd8d0f7bbmsh3c7897746993edfp13840ejsn40f673bcd163"
                },
            }),
            root: function (json) {
                return json.data.covid19Stats;
            },
            fields: [
                'country', 'province', 'city', 'lastUpdate',
                { name: 'confirmed', type: 'int' },
                { name: 'deaths', type: 'int' },
                { name: 'recovered', type: 'int' }
            ],
            listeners:
            {
                load: function () {
                    console.log('Loaded', arguments);

                    var store = myGrid.getStore().data.items;
                    console.log(store);

                    var confirmedSum = 0;
                    for (var index = 0; index < store.length; index++) {
                        confirmedSum += store[index].data.confirmed;
                    }
                    console.log('Confirmed', confirmedSum);

                    var recoveredSum = 0;
                    for (var index = 0; index < store.length; index++) {
                        recoveredSum += store[index].data.recovered;
                    }
                    console.log('Recovered', recoveredSum);

                    var deathsSum = 0;
                    for (var index = 0; index < store.length; index++) {
                        deathsSum += store[index].data.deaths;
                    }
                    console.log('Deaths', deathsSum);

                    var mortality = (100*deathsSum/(deathsSum + recoveredSum + confirmedSum)).toFixed(2)


                    statistic.getForm().setValues({
                        confirmed: confirmedSum,
                        recovered: recoveredSum,
                        deaths: deathsSum,
                        mortality: mortality + '%'
                    })
                }
            }

        },
        stripeRows: true,
        stateful: true,
        columns: [
            {
                id: 'country',
                header: 'Country',
                width: 100,
                sortable: true,
                dataIndex: 'country'
            },
            {
                id: 'province',
                header: 'Province',
                width: 100,
                sortable: true,
                dataIndex: 'province'
            },
            {
                id: 'city',
                header: 'City',
                width: 150,
                sortable: true,
                dataIndex: 'city'
            },
            {
                id: 'lastUpdate',
                header: 'Last Update',
                width: 150,
                sortable: true,
                dataIndex: 'lastUpdate'
            },
            {
                id: 'confirmed',
                header: 'Confirmed',
                width: 100,
                sortable: true,
                dataIndex: 'confirmed'
            },
            {
                id: 'recovered',
                header: 'Recovered',
                width: 100,
                sortable: true,
                dataIndex: 'recovered'
            },
            {
                id: 'deaths',
                header: 'Deaths',
                width: 100,
                sortable: true,
                dataIndex: 'deaths'
            },
        ]
    })



    var statistic = Ext.create({
        xtype: 'form',
        layout: 'form',
        height: 100,
        padding: 5,
        items: [
            {
                xtype: 'displayfield',
                name: 'confirmed',
                fieldLabel: 'Confirmed',
                value: 'Confirmed'
            },
            {
                xtype: 'displayfield',
                name: 'recovered',
                fieldLabel: 'Recovered',
                value: 'Recovered'
            },
            {
                xtype: 'displayfield',
                name: 'deaths',
                fieldLabel: 'Deaths',
                value: 'Deaths'
            },
            {
                xtype: 'displayfield',
                name: 'mortality',
                fieldLabel: 'Mortality',
                value: 'Mortality'
            },

        ]
    });


    var win = Ext.create({
        xtype: 'window',
        width: 850,
        height: 800,
        layout: '',
        items: [
            myGrid,
            statistic
        ],
        buttons: [
            {
                text: 'Reload store',
                handler: function () {
                    myGrid.getStore().reload();
                    console.log('reloaded');
                }
            },
            {
                text: 'Load store',
                handler: function (button) {
                    myGrid.getStore().load();
                    

                }
            }
        ],
    })


    win.show();

});

