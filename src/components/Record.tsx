import { FunctionComponent } from "react";
import Markdown from 'react-markdown'

type RecordProps = {
  content: string | undefined;
}

const Record: FunctionComponent<RecordProps> = ({ content }) => (<Markdown>{content}</Markdown>)

export default Record;
