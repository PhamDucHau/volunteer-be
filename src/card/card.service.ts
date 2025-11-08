import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Card } from './schemas/card.schemas';
import { Model } from 'mongoose';

@Injectable()
export class CardService {
    constructor(@InjectModel(Card.name) private cardModel: Model<Card>) { }
    getAll() {
        
        return this.cardModel.find().exec();
    }
}
