export interface Medicine {
    tkSzam: string;
    nev: string;
    inn: string;
    atcKod: string;
    kiszereles: string;
    gyarto: string;
    status: string;
    price: number;
    lastUpdate: string;
    brand: string;
    activeSubstance: string;
    internalId?: string; // Add internal ID for unique key
    packagingDetails: string;
    dispensability: string;
    dispensabilitySub: string;
    safetyFeatures: string;
    authorizationDate: string;
}

export type MedicineTableColumn = 'tkSzam' | 'nev' | 'activeSubstance' | 'kiszereles' | 'gyarto' | 'status' | 'actions' | 'packagingDetails' | 'dispensability' | 'dispensabilitySub' | 'safetyFeatures' | 'authorizationDate' | 'lastUpdate';

export type MedicineCardField = 'status' | 'tkSzam' | 'kiszereles' | 'gyarto' | 'actions' | 'packagingDetails' | 'dispensability' | 'dispensabilitySub' | 'safetyFeatures' | 'authorizationDate' | 'lastUpdate';

export interface ViewSettings {
    tableColumns: Record<MedicineTableColumn, boolean>;
    cardFields: Record<MedicineCardField, boolean>;
}

export interface Pharmacy {
    id: string;
    nev: string;
    varmegye: string;
    irsz: string;
    telepules: string;
    cim: string;
    telefon: string;
    email: string;
    latitude: number;
    longitude: number;
    mondayOpen: string;
    mondayClose: string;
    tuesdayOpen: string;
    tuesdayClose: string;
    wednesdayOpen: string;
    wednesdayClose: string;
    thursdayOpen: string;
    thursdayClose: string;
    fridayOpen: string;
    fridayClose: string;
    saturdayOpen: string;
    saturdayClose: string;
    sundayOpen: string;
    sundayClose: string;
}
