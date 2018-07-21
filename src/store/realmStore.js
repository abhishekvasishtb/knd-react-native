import {ToastAndroid} from "react-native";

const Realm = require('realm');


export const CompanySchema = {
    name: 'Company',
    // primaryKey: 'id',
    properties: {
        id: 'int',
        orgname: 'string',
        address: 'string'
    },
};

export const ReviewSchema = {
    name: 'Review',
    // primaryKey: 'id',
    properties: {
        id: 'int',
        name: 'string',
        company: 'Company',
        date: 'string',
        status: 'string'
    },

};



// Define your models and their properties
export const CarSchema = {
    name: 'Car',
    properties: {
        make:  'string',
        model: 'string',
        miles: {type: 'int', default: 0},
    }
};
export const PersonSchema = {
    name: 'Person',
    properties: {
        name:     'string',
        birthday: 'date',
        cars:     'Car[]',
        picture:  'data?' // optional property
    }
};

export function realmSaveReviews(result, status) {
    Realm.open({schema: [CompanySchema, ReviewSchema],
        schemaVersion: 3, migration: function(oldRealm, newRealm) {newRealm.deleteAll();}
    })
        .then(realm => {
            // console.log(failResp);
            // Create Realm objects and write to local storage
            realm.write(() => {

                let allBooks = realm.objects('Review').filtered('status ="scheduled"');
                realm.delete(allBooks);
                for (i=0; i<result.length;i++) {
                    // console.log(result);
                    const myCar = realm.create('Review', {
                        id: result[i].id,
                        name: result[i].name,
                        company: {id: result[i].id,
                            orgname: result[i].company.orgname,
                            address: result[i].company.address},
                        date: result[i].date,
                        status: result[i].status
                    });
                    // console.log(myCar.company);
                }
            });
        })
        .catch(error => {
            console.log(error);
        });
}



export async function realmGetReviews(status) {
    let failResp = await Realm.open({schema: [ReviewSchema, CompanySchema],
        schemaVersion: 3, migration: function(oldRealm, newRealm) {newRealm.deleteAll();}
    });
    // Realm.open({schema: [ReviewSchema, CompanySchema],
    //     schemaVersion: 3, migration: function(oldRealm, newRealm) {newRealm.deleteAll();}
    // })
    //     .then(realm => {
    //         failResp = realm.objects('Review').filtered('status = "'+status+'"').map(word => word);
    //         console.log('its here');
    //         // return failResp
    //     })
    //     .catch(error => {
    //         console.log('error!!! '+ error);
    //         // failResp = [];
    //     });
    // console.log(failResp.objects('Review').filtered('status = "scheduled"'));
    return failResp.objects('Review').filtered('status = "scheduled"').map(word => word);
}
// Realm.open({schema: [ReviewSchema, CarSchema, PersonSchema]})
//     .then(realm => {
//         // Create Realm objects and write to local storage
//         realm.write(() => {
//             const myCar = realm.create('Car', {
//                 make: 'Honda',
//                 model: 'Civic',
//                 miles: 1000,
//             });
//             myCar.miles += 20; // Update a property value
//         });
//
//         // Query Realm for all cars with a high mileage
//         const cars = realm.objects('Car').filtered('miles > 1000');
//
//         // Will return a Results object with our 1 car
//         cars.length // => 1
//         // console.log('dfgdg');
//         // let allBooks = realm.objects('Review');
//         // realm.delete(allBooks);
//         // Query results are updated in realtime
//         cars.length // => 2
//     })
//     .catch(error => {
//         console.log(error);
//     });