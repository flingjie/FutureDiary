module future_diary::future_diary {
    use std::string::{ String};
    use sui::url::{Self, Url};

    
    public struct DiaryNFT has key, store {
        id: UID,
        date: String,
        content: String,
        image_url: Url,
        timestamp: u64,
        author: address
    }

    public entry fun create_diary(
        date: String,
        content: String,
        image_url: std::ascii::String,
        ctx: &mut TxContext
    ) {
        let diary = DiaryNFT {
            id: object::new(ctx),
            date: date,
            content: content,
            image_url: url::new_unsafe(image_url),
            timestamp: tx_context::epoch(ctx),
            author: tx_context::sender(ctx)
        };
        
        transfer::transfer(diary, tx_context::sender(ctx))
    }

    public fun get_date(diary: &DiaryNFT): &String {
        &diary.date
    }

    public fun get_content(diary: &DiaryNFT): &String {
        &diary.content
    }

    public fun get_image_url(diary: &DiaryNFT): &Url {
        &diary.image_url
    }

}