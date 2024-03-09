# download-jma-pdf

## Overview
気象庁が12時間毎に発表している「短期予報解説資料」をダウンロードするGASコードです。

[短期予報解説資料](https://www.data.jma.go.jp/fcd/yoho/data/jishin/kaisetsu_tanki_latest.pdf)

## Specification
- `main.gs`の`pdfFolderId`で指定されたフォルダにPDFファイルが、`txtFolderId`で指定されたフォルダにPDF内のテキスト情報が.txtで保存されます。
- PDFファイル名はダウンロード日時、TXTファイル名は資料の発表日時です。
- PDFからのテキスト抽出は、PDFをGoogleドキュメントで開き、テキストを取得することで行っています。
