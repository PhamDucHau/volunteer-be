import { Controller, Get } from '@nestjs/common';
import { CardService } from './card.service';

@Controller('card')
export class CardController {
    constructor(private readonly cardService: CardService) { }
    @Get('')
    async getAll() {
        
        return this.cardService.getAll();
    }
}
