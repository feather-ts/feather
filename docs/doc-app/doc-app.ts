import {Construct, start, Widget} from '../../src/typescript/decorators/construct'

@Construct({selector: 'body', singleton: true})
export class DocApp implements Widget {

    init(el: Element) {
        console.log('Feather-Ts started')
    }

}
start()

