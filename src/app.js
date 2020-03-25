Ext.onReady(function () {



    var myStore = Ext.create({
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
            'country', 'province', 'city',
            { name: 'lastUpdate', type: 'date' },
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
                var recoveredSum = 0;
                var deathsSum = 0;
                for (var index = 0; index < store.length; index++) {
                    confirmedSum += store[index].data.confirmed;
                    recoveredSum += store[index].data.recovered;
                    deathsSum += store[index].data.deaths;
                }
                console.log('Confirmed', confirmedSum);
                console.log('Recovered', recoveredSum);
                console.log('Deaths', deathsSum);

                var mortalityDeathsRecovered = (100 * deathsSum / (deathsSum + recoveredSum)).toFixed(2)
                var mortalityDeathsRecoveredConfirmed = (100 * deathsSum / (deathsSum + recoveredSum + confirmedSum)).toFixed(2)


                statistic.getForm().setValues({
                    confirmed: confirmedSum,
                    recovered: recoveredSum,
                    deaths: deathsSum,
                    mortalityRec: mortalityDeathsRecovered + '%',
                    mortalityRecConf: mortalityDeathsRecoveredConfirmed + '%',

                })
            }
        },
    })
    myStore.setDefaultSort('country', 'ASC');


    var myFilter = Ext.create({
        xtype: 'form',
        itemId: 'filter',
        height: '100',
        padding: 5,
        items: [
            {
                xtype: 'combo',
                name: 'combo',
                fieldLabel: 'Country',
                store: myStore,
                displayfield: 'country',
                valueField: 'country',
                triggerAction: 'all',
                mode: 'local',
                listeners: {
                    select: function (field) {
                        console.log(field.value)
                    }
                }
            },
            {
                xtype: 'numberfield',
                name: 'numberfiledConfirmedFrom',
                fieldLabel: 'Confirmed from'
            },
            {
                xtype: 'numberfield',
                name: 'numberfiledConfirmedTo',
                fieldLabel: 'Confirmed to'
            }
        ]
    })

    var myGrid = Ext.create({
        xtype: 'grid',
        itemId: 'grid',
        height: 560,
        store: myStore,
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
                dataIndex: 'lastUpdate',
                xtype: 'datecolumn',
                format: 'Y-m-d h:i:s'

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
        ],
    })



    var statistic = Ext.create({
        xtype: 'form',
        layout: 'form',
        height: 180,
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
                name: 'mortalityRec',
                fieldLabel: 'Mortality relative to recovered',
                value: 'Mortality'
            },
            {
                xtype: 'displayfield',
                name: 'mortalityRecConf',
                fieldLabel: 'Mortality relative to recovered and confirmed',
                value: 'Mortality'
            },

        ]
    });


    var win = Ext.create({
        xtype: 'window',
        width: 850,
        height: 900,
        layout: '',
        items: [
            myFilter,
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
                    console.log(myFilter.getForm().items);

                }
            }
        ],
    })


    win.show();

});

