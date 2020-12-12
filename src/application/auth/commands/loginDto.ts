import { Field, ObjectType } from "type-graphql";

@ObjectType()
export default class LoginDto {
    @Field()
    public token: string;
    
    @Field()
    public refreshToken: string;
}