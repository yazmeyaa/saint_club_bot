import 'module-alias/register';
import { addAliases } from 'module-alias';

addAliases({
    '@src': `${__dirname}/`,
    '@services': `${__dirname}/services`,
    '@config': `${__dirname}/config`,
    '@models': `${__dirname}/models`,
    '@orm': `${__dirname}/orm`,
    '@modules': `${__dirname}/modules`,
    '@helpers': `${__dirname}/helpers`,
    '@templates': `${__dirname}/templates`,
    '@commands': `${__dirname}/commands`,
    'types': `${__dirname}/types`,
})