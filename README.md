# AD Save Converter

Allows you to convert save from post-Reality to JSON and back.

***Disclaimer: cannot convert to mobile saves! the mobile save structure is completely different!***

## How it works

There are four main steps to decoding a Reality save.

#### Step 1 - Header and Footer

Each Reality savefile has a header and footer.

The header consists of a magic: `AntimatterDimensionsSavefileFormat`, and a version number (as of April 2022, the latest version is AAB).
The footer consists of the text `EndOfSavefile`

Step 1 of decoding a save is to remove both the header and the footer - they are irrelevant to the decoding process.

#### Step 2 - Symbol Filter

Base64 encoding contains characters such as `+` and `/`, and zero or more `=` at the end. Reality saves do not contain these - presumably because the database used for cloud saving doesn't like them.

In a Reality save, all `+`s are replaced with `0b`, all `/`s are replaced with `0c`, and to avoid misinterpretation, all `0`s are replaced with `0a` (you do this first, not to mess with the `+` and `/` replacements).
During encoding, any suffixed `=`s are trimmed.

### Step 3 - Base64

A Reality savefile is encoded in Base64.

For decoding, decode from Base64.

### Step 4 - Compression

Reality saves are compressed using the [`deflate`](https://en.wikipedia.org/wiki/Deflate) algorithm.

For decoding, use the inverse of `deflate`, `inflate` on the output from the Base64 decoding.

### JSON

And there you have it - a Reality save decompressed and converted into JSON. For re-encoding, do the opposite of all the above steps in reverse order.
