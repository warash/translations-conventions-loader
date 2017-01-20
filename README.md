## Transaltion convention loader

Simple webpack loader to help reduce boilerplate code by introducing conventions
## Code Example

idea is based on AngularClass component convention loader.


if your translation file is named the same as your component file you dont have to specify this path in @Translations attribute:
home.component.ts
home.component.i18n.json

then inside you home.component.ts file you can simply type:

```javascript

@Component({})
@Translations({})
export class HomeComponent{
    
}

```
which is gonna be automatically by convention converted into:


```javascript
@Translations({ 
    remote: './home.component.i18n.json',
    static: { 'en': require('./home.component.i18n.json')
    } })

```


to achieve that you need to register webpack loader for ts files:

```javascript
        {
          test: /\.ts$/,
          use: [
            'awesome-typescript-loader',
            'angular2-template-loader',
            'translations-conventions-loader?remote=false'
          ],
          exclude: [/\.(spec|e2e)\.ts$/]
        },

```

remote - is option to say if we wanna have possiblity to use files from local for dev purposes instead of publishing everytime we make change