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
                'country','province','lastUpdate','confirmed','deaths','recovered'
            ],
            listeners:
            {
                load: function () {
                    console.log('Loaded', arguments)
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



    var win = Ext.create({
        xtype: 'window',
        width: 700,
        height: 500,
        layout: 'fit',
        items: [myGrid],
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
        ]
    })


    win.show();

});

