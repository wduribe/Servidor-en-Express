
export class PaginationDto {

    private constructor(
        public readonly page: number,
        public readonly limit: number,
    ){} 

    static create( page: number = 1, limit: number = 10 ):[string?, PaginationDto?] {
        
        if( isNaN( page ) || isNaN( limit ) ) return ['La página y el limite deben ser números'];
        if( page <= 0 ) return ['La pagina debe ser mayor de cero'];
        if( limit <= 0 ) return ['El limite debe ser mayor de cero'];
        
        return [undefined, new PaginationDto( page, limit )];
    }
} 