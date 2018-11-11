# "Read More"

You can add "Read More" button into your operation `description` by adding a special comment tag `<!-- READMORE -->` (case-sensitive).

```markdown
paths:
  '/pet/{petId}/uploadImage':
    post:
      tags:
        - pet
      summary: uploads an image
      description: |
        Lorem ipsum dolor sit amet, ne mei mentitum conceptam, no vis saepe commune, idque minimum periculis his et. Sit etiam animal honestatis no, vide interpretaris id quo. Ea odio tincidunt mei, quo id eros persecuti. An quot facete malorum ius, sea ne decore iisque.
        <!-- READMORE -->
        Mei at eros assentior, usu ullamcorper mediocritatem no. Augue minimum ea per. Ne cum veniam lobortis sadipscing, ad sit amet docendi. Et delenit iracundia vix, vel ex vero legendos antiopam, et eam modo populo.

        Eu dicat legere quo, facilisi theophrastus eam te. Nisl aeque adipisci cum id, debet reformidans ea mel. Nec ut commodo facilisis abhorreant. Ut homero consul 
...
```



![Read More](https://user-images.githubusercontent.com/127635/48308178-8ba2d580-e5a1-11e8-8cdf-10808d4822e5.gif)

