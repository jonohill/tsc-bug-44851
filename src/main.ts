
import Ajv, { AsyncValidateFunction, JSONSchemaType } from 'ajv/dist/ajv';
import addFormats from 'ajv-formats';

const ajv = new Ajv();
addFormats(ajv);

interface Inner {
    type: 'someValue'|string;
    value: number;
}

interface Middle {
    id: string,
    something: string,
    value: number,
    innerItems: Inner[]
}

export interface Outer {
    data: Middle[]
}


async function main() {

    // Comment the next line to see a huge performance improvement!
    const schema: JSONSchemaType<Outer> = {
    // And uncomment the next line
    // const schema: any = {
        $async: true,
        type: "object",
        properties: {
            data: {
                type: "array",
                items: {
                    type: "object",
                    properties: {
                        something: { type: "string" },
                        id: { type: "string" },
                        value: { type: "number" },
                        innerItems: { 
                            type: "array",
                            items: {
                                type: "object",
                                properties: {
                                    type: { type: "string" },
                                    value: { type: "number" },
                                },
                                required: ["type", "value"]
                            }
                        }
                    },
                    additionalProperties: true,
                    required: ["something", "id", "value", "innerItems"]
                }
            }
        },
        required: ["data"]
        
    };

    const validatePayload = <AsyncValidateFunction<Outer>>(ajv.compile(schema));

    let valid = await validatePayload({
        data: [
            {
                id: '123',
                something: 'hello',
                value: 123,
                innerItems: [
                    {
                        type: 'reading',
                        value: 456
                    }
                ]
            }
        ]
    });

    console.log(valid);

    await validatePayload({
        kate: 'bob'
    });

    // exception occurs above - unreachable
}

main().then(console.log).catch(console.error);

