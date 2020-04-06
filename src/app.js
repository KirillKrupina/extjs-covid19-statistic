Ext.onReady(function () {

    var myStore = Ext.create({
        xtype: 'jsonstore',
        autoLoad: true,

        proxy: new Ext.data.HttpProxy({
            url: 'http://api.covid-19/php/index.php',
        }),
        root: function (json) {
            return json;
        },
        fields: [
            'country', 'province', 'city',
            {
                name: 'lastUpdate',
                type: 'date'
            },
            {
                name: 'confirmed',
                type: 'int'
            },
            {
                name: 'deaths',
                type: 'int'
            },
            {
                name: 'recovered',
                type: 'int'
            }
        ],
        sortInfo: {
            field: 'country',
            direction: 'ASC'
        },
        listeners: {
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

                var mortalityDeathsRecovered = (100 * deathsSum / (deathsSum + recoveredSum)).toFixed(2);
                var mortalityDeathsRecoveredConfirmed = (100 * deathsSum / (deathsSum + recoveredSum + confirmedSum)).toFixed(2);


                statistic.getForm().setValues({
                    confirmed: confirmedSum,
                    recovered: recoveredSum,
                    deaths: deathsSum,
                    mortalityRec: mortalityDeathsRecovered + '%',
                    mortalityRecConf: mortalityDeathsRecoveredConfirmed + '%',

                });
            }
        },
    });


    // Array store!!!
    var myFilter = Ext.create({
        xtype: 'form',
        itemId: 'filter',
        height: '100',
        padding: 5,
        items: [{
                xtype: 'combo',
                name: 'combo',
                fieldLabel: 'Country',
                store: {
                    xtype: 'arraystore',
                    fields: ['country'],
                    data: [],

                },
                triggerConfig: {
                    tag: 'span',
                    cls: 'x-form-twin-triggers',
                    cn: [{
                            tag: "img",
                            src: Ext.BLANK_IMAGE_URL,
                            alt: "",
                            cls: "x-form-trigger my-img-trigger",
                            index: 1
                        },
                        {
                            tag: "img",
                            src: Ext.BLANK_IMAGE_URL,
                            alt: "",
                            cls: "x-form-trigger",
                            index: 2
                        }
                    ],

                },


                //------------------------

                initTrigger: function () {
                    var ts = this.trigger.select('.x-form-trigger', true);
                    ts.each(function (t, all, index) {
                        switch (index) {

                            case 0:
                                this.mon(t, 'click', this.onTriggerClick, this, {
                                    preventDefault: true
                                });
                                t.addClassOnOver('x-form-trigger-over');
                                t.addClassOnClick('x-form-trigger-click');
                                break;
                            case 1:
                                this.mon(t, 'click', this.onTriggerClearClick, this, {
                                    preventDefault: true
                                });
                                t.addClassOnOver('x-form-trigger-over');
                                t.addClassOnClick('x-form-trigger-click');
                                break;
                        }
                    }, this);
                },
                onTriggerClearClick: function () {
                    this.clearValue();
                },

                //------------------------
                // onTriggerClick: function (event) {
                //     console.log(event.target.className);
                //     var className = ' ' + event.target.className + ' ';
                //     if (className.indexOf(' myTrigger2 ') >= 0) {
                //         alert('Clicked 2');
                //     } else if (className.indexOf(' myTrigger1 ') >= 0) {
                //         Ext.form.ComboBox.superclass.onTriggerClick.apply(this, arguments);
                //     }
                //
                // },
                displayField: 'country',
                valueField: 'country',
                triggerAction: 'all',
                mode: 'local',
                listeners: {
                    select: function (field) {
                        console.log(field.value)
                    },
                    afterrender: function (combo) {
                        console.log('Combo/afterrender')
                        myStore.on('load', function (store, records) {
                            var countryArray = [];
                            for (let index = 0; index < records.length; index++) {
                                /**
                                 * @type Ext.data.Record record
                                 */
                                let record = records[index];
                                let country = record.get('country');

                                // Проверяем на дупликаты
                                if (countryArray.indexOf(country) < 0) {
                                    countryArray.push(country)
                                }
                            }

                            var records = [];
                            for (let index = 0; index < countryArray.length; index++) {
                                records.push(new Ext.data.Record({
                                    'country': countryArray[index]
                                }));

                            }

                            // нужно очистить store перед перезагрузкой его. Ибо могут дублироваться данные
                            combo.getStore().removeAll();

                            // ожидает массив records. Нужно сгенерить отдельно (выше)
                            combo.getStore().add(records);
                        }, this);
                    }
                },
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
            },
            {
                xtype: 'button',
                text: 'Submit',
                width: 100,
                handler: function () {
                    var country = myFilter.getForm().findField('combo').value;
                    var numberFrom = myFilter.getForm().findField('numberfiledConfirmedFrom').value;
                    var numberTo = myFilter.getForm().findField('numberfiledConfirmedTo').value;

                    numberFrom = parseInt(numberFrom);
                    numberTo = parseInt(numberTo);

                    store = myGrid.getStore();

                    store.filter([
                        // {
                        //     property: 'country',
                        //     value: country,
                        //     anyMatch: true, //optional, defaults to true
                        //     caseSensitive: true  //optional, defaults to true
                        // }
                        {
                            /**
                             *
                             * @param {Ext.data.Record} record
                             */
                            fn: function (record) {
                                let countryRecord = record.get('country');
                                let confirmedRecord = record.get('confirmed');


                                if (Ext.isDefined(country) && country !== countryRecord) {
                                    return false;
                                }
                                if (Ext.isDefined(numberFrom) && numberFrom > confirmedRecord) {
                                    return false;
                                }
                                if (Ext.isDefined(numberTo) && numberTo < confirmedRecord) {
                                    return false;
                                }
                                return true;


                                // if (country === undefined) {
                                //     if (numberFrom < confirmedRecord && numberTo > confirmedRecord) { return true }
                                //     if (numberFrom < confirmedRecord || numberTo > confirmedRecord) { return true }
                                // }
                                // if (numberFrom === undefined || numberTo === undefined) {
                                //     if (numberFrom < confirmedRecord && country === countryRecord) { return true }
                                //     if (numberTo > confirmedRecord && country === countryRecord) { return true }
                                // }
                                // if (numberTo === undefined && numberFrom === undefined) {
                                //     if (country === countryRecord) { return true }
                                // }
                            },
                            scope: this
                        }
                    ]);
                }
            }
        ]
    })

    var myGrid = Ext.create({
        xtype: 'grid',
        itemId: 'grid',
        height: 350,
        store: myStore,
        stripeRows: true,
        stateful: true,
        columns: [{
                id: 'country',
                header: 'Country',
                width: 100,
                sortable: true,
                dataIndex: 'country',
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
            {
                id: 'mortality',
                header: 'Mortality',
                width: 100,
                sortable: true,
                renderer: function (value, metaData, record, rowIndex, colIndex, store) {

                    var deaths = record.get('deaths');
                    var recovered = record.get('recovered');

                    var fieldMortality = (100 * deaths / (deaths + recovered)).toFixed(2);
                    if (isNaN(fieldMortality)) {
                        return 0 + '%';
                    } else {
                        return fieldMortality + '%';
                    }


                }
            }
        ]
    })


    var statistic = Ext.create({
        xtype: 'form',
        layout: 'form',
        height: 180,
        padding: 5,
        items: [{
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
        title: 'COVID-19 Statistic',
        width: 950,
        autoHeight: true,
        layout: '',
        items: [
            myFilter,
            myGrid,
            statistic
        ],
        buttons: [{
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