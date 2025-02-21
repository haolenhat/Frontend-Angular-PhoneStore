export interface City {
    code: number;
    name: string;
}

export interface District {
    code: number;
    name: string;
    wards: Ward[];
}

export interface Ward {
    code: number;
    name: string;
}
