import { VscodeEventSource } from "@supernode/shared";


class EventSource {
    public static value: VscodeEventSource = VscodeEventSource.MARKDOWNFILE;

    public static set(value: VscodeEventSource) {
        this.value = value;
    }
}


export default EventSource;