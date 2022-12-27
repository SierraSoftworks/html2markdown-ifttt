import 'jasmine'

import {htmlToMarkdown} from '../parser'

describe('htmlToMarkdown', () => {
    describe("integration tests", () => {
        it("should convert the Merriam-Webster word of the day correctly", () => {
            const raw = `<font size="-1" face="arial, helvetica"> <p> <strong> <font color="#000066">Merriam-Webster's Word of the Day for December 27, 2022 is:</font> </strong> </p> <p> <strong>cajole</strong> &#149; \kuh-JOHL\&nbsp; &#149; <em>verb</em><br /> <p><em>Cajole</em> usually means "to persuade someone to do something or to give you something by making promises or saying nice things." It can also mean "to deceive with soothing words or false promises."</p> <p>// She <em>cajoled</em> her partner into going to the party with her.</p> <p>// They hoped to <em>cajole</em> him into cooperating.</p> <p><a href="https://www.merriam-webster.com/dictionary/cajole">See the entry ></a></p> </p> <p> <strong>Examples:</strong><br /> <p>"Park operators can direct traffic using the app by notifying visitors where the shortest lines are and offering food and merchandise promotions to <em>cajole</em> them to other areas." — Robbie Whelan, <em>The Wall Street Journal</em>, 27 Aug. 2022</p> </p> <p> <strong>Did you know?</strong><br /> <p>However hard we try, we can’t cajole the full history of <em>cajole</em> from the cages of obscurity. We know that it comes from French <em>cajoler</em>, meaning "to give much attention to; to make a fuss over; to flatter or persuade with flattery"—no surprise there. But the next chapter of the word’s history may, or may not, be for the birds: it’s possible that <a href="https://www.merriam-webster.com/dictionary/cajole#word-history"><em>cajoler</em></a> is descended from a word that is cage-bound twice over. One potential ancestor both comes from a word meaning "birdcage" and was formed under the influence of the Anglo-French word <em>cage</em>, whence also comes our word <em>cage</em>. The ancestor of our word <a href="https://www.merriam-webster.com/dictionary/jail#word-history"><em>jail</em></a> is in this lineage as well.</p> <br /><br /> </p> </font>`
            const expected = [
                `**Merriam-Webster's Word of the Day for December 27, 2022 is:**`,
                `**cajole** \u0095 kuh-JOHL\u00a0 \u0095 *verb*`,
                `*Cajole* usually means "to persuade someone to do something or to give you something by making promises or saying nice things." It can also mean "to deceive with soothing words or false promises."`,
                `// She *cajoled* her partner into going to the party with her.`,
                `// They hoped to *cajole* him into cooperating.`,
                `[See the entry >](https://www.merriam-webster.com/dictionary/cajole)`,
                `**Examples:**`,
                `"Park operators can direct traffic using the app by notifying visitors where the shortest lines are and offering food and merchandise promotions to *cajole* them to other areas." — Robbie Whelan, *The Wall Street Journal*, 27 Aug. 2022`,
                `**Did you know?**`,
                `However hard we try, we can’t cajole the full history of *cajole* from the cages of obscurity. We know that it comes from French *cajoler*, meaning "to give much attention to; to make a fuss over; to flatter or persuade with flattery"—no surprise there. But the next chapter of the word’s history may, or may not, be for the birds: it’s possible that [*cajoler*](https://www.merriam-webster.com/dictionary/cajole#word-history) is descended from a word that is cage-bound twice over. One potential ancestor both comes from a word meaning "birdcage" and was formed under the influence of the Anglo-French word *cage*, whence also comes our word *cage*. The ancestor of our word [*jail*](https://www.merriam-webster.com/dictionary/jail#word-history) is in this lineage as well.`
            ]

            expect(htmlToMarkdown(raw).split('\n').filter(x => !!x)).toEqual(expected)
        })
    })
})