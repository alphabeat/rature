Fixture PDFs for `bun run stress:ner --pdf <file>` and for a manual check in the app. Each one
triggered a bug of the post-NER steps (see the comment at the top of its HTML). Rebuild a PDF with:

    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless --no-pdf-header-footer \
      --print-to-pdf=form-leaders.pdf form-leaders.html
