/**
 * Created by lwj_312 on 17-7-12.
 */
function loadAllItems() {
    return [
        {
            barcode: 'ITEM000000',
            name: '可口可乐',
            unit: '瓶',
            price: 3.00
        },
        {
            barcode: 'ITEM000001',
            name: '雪碧',
            unit: '瓶',
            price: 3.00
        },
        {
            barcode: 'ITEM000002',
            name: '苹果',
            unit: '斤',
            price: 5.50
        },
        {
            barcode: 'ITEM000003',
            name: '荔枝',
            unit: '斤',
            price: 15.00
        },
        {
            barcode: 'ITEM000004',
            name: '电池',
            unit: '个',
            price: 2.00
        },
        {
            barcode: 'ITEM000005',
            name: '方便面',
            unit: '袋',
            price: 4.50
        }
    ];
}

function createAllTags(tags) {
    let i = 0;
    let AllTags = [];
    for (let tag of tags) {
        let cuted = tag.split("-");
        if (cuted.length === 1) {
            AllTags[i++] = { barcode: cuted[0], count: 1 };
        } else {
            AllTags[i++] = { barcode: cuted[0], count: parseFloat(cuted[1]) };
        }
    }
    return AllTags;
}

function createAllItems(AllTags){
    let AllItems=[];
    let loadresult=loadAllItems();
    let a;
    let i;
    for(a=0;a<AllTags.length;a++){
        for(i=0;i<loadresult.length;i++ ) {
            if (AllTags[a].barcode == loadresult[i].barcode)
                AllItems[a]={barcode:AllTags[a].barcode,name:loadresult[i].name,unit: loadresult[i].unit, price:loadresult[i].price,count:AllTags[a].count};
        }
        }
      return AllItems;
}


function createNewItems(AllItems) {
    let NewItems=[];
    let n=0;
    let i;
    let count;
    for(i=0;i<AllItems.length-1;i++)
    {
        NewItems[n]={barcode:AllItems[i].barcode,name:AllItems[i].name,unit: AllItems[i].unit, price:AllItems[i].price,count:AllItems[i].count};
        if(i==0) count=AllItems[i].count;
        if(AllItems[i+1].barcode!==AllItems[i].barcode)
        {NewItems[n].count=count;
            n++;
            count=AllItems[i+1].count;
        }
        else
          {count+=AllItems[i+1].count;
            NewItems[n].count=count;}

    }
    if(AllItems[AllItems.length-1].barcode!==AllItems[AllItems.length-2].barcode)
    NewItems[n]={barcode:AllItems[AllItems.length-1].barcode,name:AllItems[AllItems.length-1].name,unit: AllItems[AllItems.length-1].unit, price:AllItems[AllItems.length-1].price,count:AllItems[AllItems.length-1].count};

    return NewItems;
}

function loadPromotions() {
    return [
        {
            type: 'BUY_TWO_GET_ONE_FREE',
            barcodes: [
                'ITEM000000',
                'ITEM000001',
                'ITEM000005'
            ]
        }
    ];
}

function createDiscountedItems(NewItems) {
    let DiscountedItems=[];
    let promotions=loadPromotions()[0].barcodes;
     for(let n=0;n<NewItems.length;n++)
        {DiscountedItems[n]={barcode:NewItems[n].barcode,name:NewItems[n].name,unit:NewItems[n].unit,price:NewItems[n].price,count:NewItems[n].count};
            for(let promotion of promotions)
            {if(NewItems[n].barcode===promotion&&NewItems[n].count>2)
                DiscountedItems[n].count-=1;
            }

        }
    return DiscountedItems;
}

function buildsheet(NewItems,DiscountedItems) {
    let sheet=[];
    let calculatedprice=calculateprice(NewItems,DiscountedItems);
    let n;
    for(n=0;n<NewItems.length;n++)
    {

        sheet[n]={
            barcode:NewItems[n].barcode,
            name:NewItems[n].name,
            count:NewItems[n].count,
            unit:NewItems[n].unit,
            price:NewItems[n].price
        };

        sheet[n].subprice_now=calculatedprice.subprice_now[n];

    }
    sheet.total_now=calculatedprice.total_now;
    sheet.save=calculatedprice.save;
    return sheet;
}

function calculateprice(NewItems,DiscountedItems) {
    let total=0;
    let total_now=0;
    let subprice=[];
    let subprice_now=[];
    for(let n=0;n<NewItems.length;n++)
    { subprice[n]=NewItems[n].count*NewItems[n].price;
        total+=subprice[n];
    }
    for(let n=0;n<DiscountedItems.length;n++)
    { subprice_now[n]=DiscountedItems[n].count*DiscountedItems[n].price;
        total_now+=subprice_now[n];
    }
    let save=total-total_now;
    return{
        subprice_now,
        total_now,
        save};
}

function buildperstrings(onestuffsheet) {
    return`名称：${onestuffsheet.name}，数量：${onestuffsheet.count}${onestuffsheet.unit}，单价：${onestuffsheet.price.toFixed(2)}(元)，小计：${onestuffsheet.subprice_now.toFixed(2)}(元)`

}

function buildreceiptstrings(sheet) {
    let receiptstrings="";
    for(let n=0;n<sheet.length-1;n++)
    {  perstrings=buildperstrings(sheet[n])+'\n';
        receiptstrings+=perstrings;
    }
    receiptstrings+=buildperstrings(sheet[sheet.length-1]);
    return receiptstrings;
}

function showReceipt(sheet) {
    let receiptstrings=buildreceiptstrings(sheet);
    return`***<没钱赚商店>收据***
${receiptstrings}
----------------------
总计：${sheet.total_now.toFixed(2)}(元)
节省：${sheet.save.toFixed(2)}(元)
**********************`

}

function printReceipt(tags) {
    let AllTags=createAllTags(tags);
    let AllItems=createAllItems(AllTags);
    let NewItems=createNewItems(AllItems);
    let DiscountedItems=createDiscountedItems(NewItems);
    let sheet=buildsheet(NewItems,DiscountedItems);
    let result=showReceipt(sheet);
    console.log(result);
}

const tags = [
    'ITEM000001',
    'ITEM000001',
    'ITEM000001',
    'ITEM000001',
    'ITEM000001',
    'ITEM000003-2.5',
    'ITEM000005',
    'ITEM000005-2',
];
printReceipt(tags);

